import { execSync } from 'node:child_process';

const repo = 'yuki153/test-gh-actions-deploy';
const from = process.argv[2]; // 前回タグ
const to = process.argv[3];   // 今回タグ

if (!from || !to) {
  console.error('Usage: node generate-pr-changelog.js <from_tag> <to_tag>');
  process.exit(1);
}

const separationMark = '--- COMMIT_SEPARATOR ---';

// マージコミットを取得（%B で完全なコミットメッセージを取得）
const log = execSync(`git log --merges --pretty=format:'%B%n${separationMark}' ${from}...${to}`).toString();

// コミットメッセージを分割して処理（セパレータで区切る）
const commits = log.split(separationMark).filter(commit => commit.trim());

const changelog = commits
  .map(commit => {
    const lines = commit.split('\n').filter(line => line.trim());
    if (lines.length === 0) return null;

    // マージコミット構文は通常1行目に存在
    const firstLine = lines[0];
    // PRタイトルは通常2行目に存在
    const prTitle = lines[1] || '';
    
    // "Merge pull request #123 from branch-name" 形式をチェック
    const match = firstLine.match(/Merge pull request #(\d+) from ([\w\-\/\.]+)/i);
    if (match) {
      const prNumber = match[1];
      const branchName = match[2];
      
      // PR タイトルがある場合はそれを使用、ない場合はブランチ名から推測
      const title = prTitle || branchName.split('/').pop() || branchName;
      return `- ${title} ([#${prNumber}](https://github.com/${repo}/pull/${prNumber}))`;
    } else {
      // 形式に合わないコミットもフィルタリング（通常のコミットメッセージの場合）
      const firstLine = lines[0];
      if (firstLine.startsWith('Merge branch') || firstLine.startsWith('Merge remote-tracking')) {
        return null; // ブランチマージは除外
      }
      return `- ${firstLine}`;
    }
  })
  .filter(item => item !== null) // null を除外
  .join('\n');

if (changelog) {
  console.log(changelog);
} else {
  console.log('No pull request merges found in the specified range.');
}