import { execSync } from 'node:child_process';

// 最新のタグ情報を取得する
const latestTag = execSync(`git describe --tags --abbrev=0`).toString().trim();

const repo = 'yuki153/test-gh-actions-deploy';
const from = process.argv[2] || latestTag; // 前回タグ
const to = process.argv[3] || "HEAD";      // 今回タグ

console.log(`Command: node bin/generate-pr-changelog.mjs ${from} ${to}`);

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

    // merge の commit message 設定が default の場合の正規表現
    const defaultRegex = /Merge pull request #(\d+) from ([\w\-\/\.]+)/i;
    // merge の commit message 設定が PR Title の場合の正規表現
    const prTitleRegex = /^(.*)\s+\(#(\d+)\)$/;

    // "Merge pull request #123 from branch-name" 形式をチェック
    let match = firstLine.match(defaultRegex);
    if (match) {
      const prNumber = match[1];
      const branchName = match[2];

      // PR タイトルがある場合はそれを使用、ない場合はブランチ名から推測
      const title = prTitle || branchName.split('/').pop() || branchName;
      return `- ${title} ([#${prNumber}](https://github.com/${repo}/pull/${prNumber}))`;
    }

    // "PR Title (#123)" 形式をチェック
    match = firstLine.match(prTitleRegex);
    if (match) {
      const title = match[1];
      const prNumber = match[2];
      return `- ${title} ([#${prNumber}](https://github.com/${repo}/pull/${prNumber}))`;
    }

    // 形式に合わないコミットもフィルタリング（通常のコミットメッセージの場合）
    if (firstLine.startsWith('Merge branch') || firstLine.startsWith('Merge remote-tracking')) {
      return null; // ブランチマージは除外
    }
    return `- ${firstLine}`;
  })
  .filter(item => item !== null) // null を除外
  .join('\n');

if (changelog) {
  console.log(changelog);
} else {
  console.log('No pull request merges found in the specified range.');
}
