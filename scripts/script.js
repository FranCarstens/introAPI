// Email: play.carstens@gmail.com
// API Key: c2451c1bffc14ebbb0b25d2c1ec05364

// PseudoCode
//
//	* Request data from the remote server (API at http://sunlightlabs.github.io/openstates-api/legislators.html#methods/legislator-search)
//		* openstates.org/api/v1/legislators/?
//	* Start listening for a response from the remote server
//	* Accept dataObject from the remote server
//	* For every result received from the remote server write an html block
//	* Write the proper query via a text input and submit it to the server
//	* Use API to return 10 results at a time


// Global Variables
var searchInput = document.querySelector('#searchBox'),
	searchResultsContainer = document.querySelector('#results'),
	moreButton = document.querySelector('#add10'),
	enterKey = 13

// Format Data Function

var formatData = function(dataObject) {

	var searchResults = dataObject["results"]
	searchResultsContainer.innerHTML = ""
	var resultContainer = ""

	for ( var key in searchResults ) {

		var resultString = "",
			firstName = searchResults[key]["first_name"],
			lastName = searchResults[key]["last_name"],
			title = searchResults[key]["title"],
			partyI = searchResults[key]["party"],
			state = searchResults[key]["state_name"],
			email = searchResults[key]["oc_email"],
			website = searchResults[key]["website"],
			facebook = searchResults[key]["facebook_id"],
			twitter = searchResults[key]["twitter_id"],
			end = searchResults[key]["term_end"]

		resultString += '<div class="search_result ' + firstName.toLowerCase() + '_' + lastName.toLowerCase() + ' party_' + partyI.toLowerCase() + '">'
		resultString += '<h3>' + firstName + ' ' + lastName + '</h3>'
		resultString += '<h4>' + title + ' &#8211 ' + partyI + '-' + state + '</h4>'
		resultString += '<ul><li><strong>email:</strong> ' + email + '</li><li><strong>website:</strong> ' + website + '</li><li><strong>facebook:</strong> ' + facebook + '</li><li><strong>twitter:</strong> ' + twitter + '</li></ul>'
		resultString += '<sub>Term End > ' + end + '</sub>'
		resultString += '</div>'

		searchResultsContainer.innerHTML += resultString

	}
}

// Search Data Function

var searchArea = function(keyPress) {

	console.log(keyPress)
	if ( keyPress.keyCode === enterKey ) {
		var searchQuery = searchInput.value
		searchFunction(searchQuery)
	}
	
}


// Request Data Function via "zipcode"

var searchFunction  = function(zipCode) {

	if (zipCode) {
		var openStatesURL = 'https://congress.api.sunlightfoundation.com/legislators/locate?apikey=c2451c1bffc14ebbb0b25d2c1ec05364&zip=' + zipCode	
	}
	else if (!zipCode) {
		var openStatesURL = 'https://congress.api.sunlightfoundation.com/legislators/?apikey=c2451c1bffc14ebbb0b25d2c1ec05364&per_page=10'
	}

	var promise = $.getJSON(openStatesURL)
	promise.then(formatData)

}

searchInput.addEventListener('keydown', searchArea)
moreButton.addEventListener('click', searchFunction)
searchFunction()






