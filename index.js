import fs from "fs";
import { program } from "commander";

const getRepos = async (username) => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (err) {
    throw new Error(`Error fetching repos: ${err.message}`);
  }
};

const validateUsername = (username) => {
  if (!username || typeof username !== "string" || username.trim() === "") {
    throw new Error("Username must be a non-empty string");
  }
  if (!/^[a-zA-Z0-9-]+$/.test(username)) {
    throw new Error("Username contains invalid characters");
  }
  return username.trim();
};

program
  .name("Github-Repos")
  .description("CLI to fetch GitHub repositories for a specific user")
  .version("1.0.0");

program
  .command("get")
  .description("Fetch GitHub repositories and save their names to a file")
  .argument("<username>", "string to split")
  .action(async (username) => {
    try {
      const validUsername = validateUsername(username);
      const data = await getRepos(validUsername);
      const repoNames = data.map((repo) => repo.name).join("\n");

      await fs.promises.writeFile(`${validUsername}.txt`, repoNames);
      console.log(`Data saved in ${validUsername}.txt`);
    } catch (err) {
      console.error("Error:", err.message);
    }
  });

program.parse();
