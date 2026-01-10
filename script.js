const input = document.getElementById("usernameInput");
const searchBtn = document.getElementById("searchBtn");
const profileDiv = document.getElementById("profile");
const reposDiv = document.getElementById("repos");
const errorMessage = document.getElementById("errorMessage");
const loading = document.getElementById("loading");

searchBtn.addEventListener("click", searchUser);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchUser();
});

async function searchUser() {
  const username = input.value.trim();

  if (username === "") {
    alert("Please enter a GitHub username");
    return;
  }

  errorMessage.textContent = "";
  profileDiv.innerHTML = "";
  reposDiv.innerHTML = "";
  loading.textContent = "Loading...";

  try {
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) throw new Error("User not found");

    const userData = await userResponse.json();
    displayProfile(userData);

    const repoResponse = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    let repos = await repoResponse.json();

    // Sort repos by stars (highest first)
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count);

    // Limit to top 10 repos
    displayRepos(repos.slice(0, 10));

    loading.textContent = "";
  } catch {
    loading.textContent = "";
    errorMessage.textContent = "User not found";
  }
}

function displayProfile(user) {
  profileDiv.innerHTML = `
    <img src="${user.avatar_url}" alt="Avatar">
    <div>
      <h2>${user.name || "No Name"}</h2>
      <p>@${user.login}</p>
      <p>${user.bio || "No bio available"}</p>
      <p>📍 ${user.location || "N/A"}</p>
      <p>
        👥 Followers: ${user.followers} |
        Following: ${user.following}
      </p>
      <a href="${user.html_url}" target="_blank">View GitHub Profile</a>
    </div>
  `;
}

function displayRepos(repos) {
  reposDiv.innerHTML = "<h3>Top Repositories ⭐</h3>";

  repos.forEach((repo) => {
    const div = document.createElement("div");
    div.className = "repo";
    div.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      <span>${repo.description || "No description"}</span>
      <span>⭐ ${repo.stargazers_count}</span>
    `;
    reposDiv.appendChild(div);
  });
}
const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "🌙 Dark Mode";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    themeToggle.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  } else {
    themeToggle.textContent = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  }
});