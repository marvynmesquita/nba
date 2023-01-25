const mainSection = document.querySelector('.s-main');
const logolink = document.querySelector('.logo-link');

const allTeams = async () => {
    const apiResponse = await fetch(`https://api.sportsdata.io/v3/nba/scores/json/teams?key=7ac88cd61be744f68e4568b46cfecdf6`)
    const response = await apiResponse.json()
    if (response != undefined){
        mainSection.innerHTML = '';
        response.forEach(equip => {
            const team = document.createElement('div');
            const teamLogo = document.createElement('img');
            const teamName = document.createElement('span');
            team.classList.add('team', 'card');
            teamLogo.classList.add('logo');
            teamName.classList.add('name');
            teamName.innerHTML = equip.Name;
            teamLogo.src = equip.WikipediaLogoUrl;
            team.setAttribute('id', equip.Key);
            team.appendChild(teamLogo);
            team.appendChild(teamName);
            mainSection.appendChild(team);
            team.addEventListener('click', () => {
                allPlayers(team.id, equip.WikipediaLogoUrl, equip.Name)
            })      
        });
    }
};

const allPlayers = async (team, teamLogo, teamName) => {
    const teamResponse = await fetch(`https://api.sportsdata.io/v3/nba/scores/json/Players/${team}?key=7ac88cd61be744f68e4568b46cfecdf6`)
    const response2 = await teamResponse.json();
    if (response2 !== undefined) {
        mainSection.innerHTML = '';
        const currentTeam = document.createElement('div');
        currentTeam.classList.add('currentTeam', 'card');
        const teamInfo = document.createElement('div');
        teamInfo.classList.add('teamInfo');
        const currentLogo = document.createElement('img');
        currentLogo.src = teamLogo;
        currentLogo.classList.add('currentLogo');
        const currentName = document.createElement('span');
        currentName.innerHTML = teamName;
        currentName.classList.add('currentName');
        teamInfo.appendChild(currentLogo);
        teamInfo.appendChild(currentName);
        const players = document.createElement('ul');
        players.classList.add('players');
        currentTeam.appendChild(teamInfo);
        response2.forEach(player => {
            const playerList = document.createElement('li');
            playerList.classList.add('player');
            const playerInfo = document.createElement('div');
            playerInfo.classList.add('playerInfo');
            const playerPic = document.createElement('img');
            playerPic.classList.add('playerPic');
            playerPic.src = player.PhotoUrl
            const playerName = document.createElement('span');
            playerName.classList.add('playerName');
            playerName.innerHTML = player.FanDuelName
            playerInfo.appendChild(playerPic);
            playerInfo.appendChild(playerName);
            playerList.appendChild(playerInfo);
            players.appendChild(playerList);
        });
        currentTeam.appendChild(players);
        mainSection.appendChild(currentTeam);
    }
};

allTeams()

logolink.addEventListener('click', (event) => {
    event.preventDefault();
    allTeams();
})