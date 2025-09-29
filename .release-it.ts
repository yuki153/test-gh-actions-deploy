import dayjs from 'dayjs';
import ja from 'dayjs/locale/ja';
import type { Config } from 'release-it';

const gitOption = process.env.ENV === "prd" ? {
    tagMatch: "prd-v[0-9]\.[0-9]\.[0-9]",
    tagName: "prd-v${version}",
} : {
    tagMatch: "test-v[0-9]\.[0-9]\.[0-9]",
    tagName: "test-v${version}",
};

const githubOption = process.env.ENV === "prd" ? {
    release: true,
    // generate release notes を有効にするか
    autoGenerate: true,
    releaseName: "PRD-Release ${version}"
} : {
    release: false,
}

export default {
    hooks: {
        "before:init": ["git pull"],
    },
    git: {
        changelog: "node changelog.mjs ${from} ${to}",
        // tag push まで実行されないため true にする
        push: true,
        // package.json の version や changelog 等変更（commit）しないので false にする
        commit: false,
        // local に作業途中のファイルが存在しても tag push できるようにする
        requireCleanWorkingDir: false,
        tagAnnotation: dayjs().locale(ja).format("YYYY年M月DD日(ddd) HH:MM"),
        ...gitOption,
    },
    github: {
        ...githubOption,
    },
    npm: {
        // release-it 実行で package.json の version が increment されないように publish: false とする
        publish: false,
    }
} satisfies Config;