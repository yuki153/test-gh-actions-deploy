const gitOption = process.env.ENV === "prd" ? {
    tagMatch: "prd-v[0-9]\.[0-9]\.[0-9]",
    tagName: "prd-v${version}",
} : {
    tagMatch: "test-v[0-9]\.[0-9]\.[0-9]",
    tagName: "test-v${version}",
};

const githubOption = process.env.ENV === "prd" ? {
    release: true,
    autoGenerate: true,
    releaseName: "PRD-Release ${version}"
} : {
    release: false,
}

module.exports = {
    git: {
        // tag push まで実行されないため true にする
        push: true,
        // package.json の version や changelog 等変更（commit）しないので false にする
        commit: false,
        // local に作業途中のファイルが存在しても tag push できるようにする
        requireCleanWorkingDir: false,
        requireBranch: "main",
        ...gitOption,
    },
    github: {
        ...githubOption,
    },
    // release-it 実行で package.json の version が increment されないように npm: false とする
    npm: false,
}