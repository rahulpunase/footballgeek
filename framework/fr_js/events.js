// EVENTS
$(function() {
  getAllTeams();
  getAllLeagues();
  matchDayPopulate();
});

function getAllTeams() {
  const $teamOne = $("#teamOne");
  const $teamTwo = $("#teamTwo");
  $.ajax({
    url: "http://localhost:3000/framework/getallteams",
    cache: false,
    type: "GET",
    success: function(response) {
      if (response.success) {
        const teams = response.clubTeams;
        let complete = "";
        teams.map(function(e, i) {
          complete += `<option value="${e._id}" data-index="${i}">${
            e.name
          }</option>`;
        });
        $teamOne.append(complete);
        $teamTwo.append(complete);
      }
    }
  });
}

function getAllLeagues() {
  const $leagueassociated = $("#leagueassociated");
  $.ajax({
    url: "http://localhost:3000/framework/getallleagues",
    cache: false,
    type: "GET",
    success: function(response) {
      if (response.success) {
        const leagues = response.leagues;
        let complete = "";
        leagues.map(function(e, i) {
          complete += `<option value="${e._id}" data-index="${i}">${
            e.name
          }</option>`;
        });
        $leagueassociated.append(complete);
      }
    }
  });
}

function matchDayPopulate() {
    let complete = '';
    const $matchday = $("#matchday");
  for (let i = 1; i <= 38; i++) {
      complete+=`<option value="${i}">Match Day ${i}</option>`
  }
  $matchday.append(complete);
}
