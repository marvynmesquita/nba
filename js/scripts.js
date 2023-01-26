const mainSection = document.querySelector('.s-main');
const logolink = document.querySelector('.logo-link');
const backButton = document.querySelector('.back-btn');
const currentDate = new Date
const currentSeason = currentDate.getFullYear();


const graphStyle = async(teamID, season) => {
        var graph = document.querySelector('.graph')
        const statsSeason = await fetch(`https://api.sportsdata.io/v3/nba/scores/json/TeamGameStatsBySeason/${season}/${teamID}/all?key=7ac88cd61be744f68e4568b46cfecdf6`)
        const responseSeason = await statsSeason.json();
        if (responseSeason !== undefined) {
            const seasonMap = responseSeason.map(mapGameLogs)
            const seasonMedia = calcMediaArray(seasonMap)
            const w = seasonMedia[0]
            const l = seasonMedia[1]
            const t = w + l
            const wPercents = (100*w)/t
            const lPercents = (100*l)/t
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart);
            function drawChart() {
                var data = google.visualization.arrayToDataTable([
                    ['Wins', 'Losses'],
                    ['Wins', wPercents],
                    ['Losses',lPercents],
                ]);
        
                var options = {
                    chart: {
                    title: 'Win x Loss',
                    },
                    backgroundColor: 'none',
                    colors: ['#253B73', '#B52532'],
                    titleTextStyle: {
                    color: '#ffffff',            
                    },
                    legend: {
                        textStyle: {
                            color: '#ffffff',   
                        },
                    },
                    is3D: true,
                };
        
                var chart = new google.visualization.PieChart(graph);
                chart.draw(data, options);
              }
        }

};

const allTeams = async () => {
    window && window.scroll(0,0);
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
    backButton.style.display = 'none';
};

const allPlayers = async (team, teamLogo, teamName) => {
    window && window.scroll(0,0);
    const teamResponse = await fetch(`https://api.sportsdata.io/v3/nba/scores/json/Players/${team}?key=7ac88cd61be744f68e4568b46cfecdf6`)
    const response2 = await teamResponse.json();
    const teamID = response2[0].TeamID
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
        const statsSpan = document.createElement('span');
        statsSpan.innerHTML = 'Current season stats';
        const graphDiv = document.createElement('div');
        const wDiv = document.createElement('div');
        const lDiv = document.createElement('div');
        statsSpan.classList.add('season');
        wDiv.classList.add('win');
        lDiv.classList.add('loss');
        graphDiv.classList.add('graph');
        graphDiv.appendChild(wDiv);
        graphDiv.appendChild(lDiv);
        teamInfo.appendChild(currentLogo);
        teamInfo.appendChild(currentName);
        teamInfo.appendChild(statsSpan);
        teamInfo.appendChild(graphDiv);
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
    graphStyle(teamID, currentSeason);
    backButton.style.display = 'block';
};


allTeams()

const mapGameLogs =(e) =>{
    return [e.Wins, e.Losses, e.Points, e.BlockedShots , e.Rebounds, e.Assists]
}

function calcMediaArray(arrays) {
    return arrays.reduce((acc, array) => acc.map((sum, i) => sum + array[i]), new Array(arrays[0].length).fill(0));
}

logolink.addEventListener('click', (event) => {
    event.preventDefault();
    allTeams();
})

backButton.addEventListener('click', (event) => {
    event.preventDefault();
    allTeams();
})