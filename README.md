# Test GitHub Actions deploy by tag push

以下のテストのためのリポジトリ

* tag push を trigger とした GitHub Pages への deploy
* release-it を使用した tag version の自動 increment
* release-it を使用した GitHub Releases の自動生成

### changelog の出力

以下の script 実行で現在ブランチの最新コミットに最も近いタグバージョンの最終コミット〜現在ブランチの最新コミットの変更差分を出力する。変更差分は merge pull request commit のみが差分として表示される。

```bash
npm run changelog
```
