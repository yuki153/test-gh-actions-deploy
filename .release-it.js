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
        push: true,
        commit: false,
        requireCleanWorkingDir: false,
        requireBranch: "main",
        ...gitOption,
    },
    github: {
        ...githubOption,
    },
    npm: false,
}