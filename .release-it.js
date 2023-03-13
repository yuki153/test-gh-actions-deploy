const gitOption = process.env.ENV === "prd" ? {
    tagMatch: "prd-v[0-9]\.[0-9]\.[0-9]",
    tagName: "prd-v${version}",
} : {
    tagMatch: "test-v[0-9]\.[0-9]\.[0-9]",
    tagName: "test-v${version}",
};

const githubOption = process.env.ENV === "prd" ? {
    autoGenerate: true,
} : {
    autoGenerate: false,
}

module.exports = {
    git: {
        push: false,
        commit: false,
        requireCleanWorkingDir: false,
        requireBranch: "main",
        ...gitOption,
    },
    github: {
        release: true,
        ...githubOption,
    },
    npm: false,
}