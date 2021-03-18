import { Tooltip } from "@material-ui/core";
import React from "react";
import { ReactComponent as GitHubIcon } from "../../assets/icons/github-mark.svg";
import { useIsScreenSmallContext } from "../../contexts/ScreenSmallContext";
import { useThemeContext } from "../../contexts/ThemeContext";
import "./GitHubRepoLink.css";

function GitHubRepoLink() {
    const isScreenSmall = useIsScreenSmallContext();
    const { theme } = useThemeContext();

    return (
        <Tooltip title="GitHub repository" arrow>
            <a
                href="https://github.com/priyanshurav/painter"
                target="_blank"
                className={`github-repo-link ${
                    isScreenSmall ? "small-screen" : ""
                } ${theme}`}
                rel="noopener noreferrer"
            >
                <GitHubIcon />
            </a>
        </Tooltip>
    );
}

export default GitHubRepoLink;
