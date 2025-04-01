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

program
  .name("Github-Repos")
  .description("CLI to get github repositories of specific user")
  .version("1.0.0");

program
  .command("get")
  .description(
    "get github repositories of specific user and store there names in the file with the user is username"
  )
  .argument("<username>", "string to split")
  .action(async (username) => {
    try {
      const data = await getRepos(username);
      const repoNames = data.map((repo) => repo.name).join("\n");

      await fs.promises.writeFile(`${username}.txt`, repoNames);
      console.log(`Data saved in ${username}.txt`);
    } catch (err) {
      console.error("Error:", err.message);
    }
  });

program.parse();
