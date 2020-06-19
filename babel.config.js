module.exports = {
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-flow"
    ],
    "plugins": [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-syntax-dynamic-import",
        "universal-import",
        "react-hot-loader/babel",
        "emotion"
    ],
    "env": {
        "development": {
            "plugins": [
                "react-hot-loader/babel"
            ]
        }
    }
}