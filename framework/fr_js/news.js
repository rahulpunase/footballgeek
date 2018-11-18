$("document").ready(function(){
  getAllTeams();
  getAllLeagues();
});



function getAllTeams() {
  const $associatedClub = $("#associatedClubs");
  $.ajax({
    url: 'http://localhost:3000/framework/getallteams',
    cache: false,
    type: 'GET',
    success: function(response) {
      if(response.success) {
        const teams = response.clubTeams
        let complete='';
        teams.map(function(e, i) {
          complete+=`<option value="${e._id}" data-index="${i}">${e.name}</option>`;
        });
        $associatedClub.append(complete);
        $associatedClub.multiSelect();
      }
    }
  })
}

function getAllLeagues() {
  const $associatedLeague = $("#associatedLeague");
  $.ajax({
    url: 'http://localhost:3000/framework/getallleagues',
    cache: false,
    type: 'GET',
    success: function(response) {
      if(response.success) {
        const leagues = response.leagues
        let complete='';
        leagues.map(function(e, i) {
          complete+=`<option value="${e._id}" data-index="${i}">${e.name}</option>`;
        });
        $associatedLeague.append(complete);
        $associatedLeague.multiSelect();
      }
    }
  })
}
