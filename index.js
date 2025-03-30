const fs = require("fs");

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
    throw new Error("Error fetching repos:", err.message);
  }
};

const username = "AhmedredaG";
getRepos(username)
  .then((data) => {
    const repoNames = data.map((repo) => repo.name).join("\n");

    fs.writeFile(`${username}.txt`, repoNames, (err) => {
      console.log(err ? err.message : `Data saved in ${username}.txt`);
    });
  })
  .catch((err) => console.log(err));
