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
var searchOptions = document.querySelector('#searchOptions'),
searchInput = document.querySelector('#searchBox'),
searchResultsContainer = document.querySelector('#results'),
moreButton = document.querySelector('#add12'),
openStatesURL = 'https://congress.api.sunlightfoundation.com/legislators?apikey=c2451c1bffc14ebbb0b25d2c1ec05364',
currentPage = 0,
enterKey = 13

// Format Data Function

var formatData = function(dataObject) {

	console.log(dataObject)

	var searchResults = dataObject["results"]
	// searchResultsContainer.innerHTML = ""
	// var resultContainer = ""

	for ( var i = 0; i < searchResults.length; i++ ) {

		if ( searchResults.length < 12 ) {
			moreButton.style.visibility = "hidden"
		}
		else { moreButton.style.visibility = "visible" }

			var resultString = "",
		firstName = searchResults[i]["first_name"],
		lastName = searchResults[i]["last_name"],
		title = searchResults[i]["title"],
		partyI = searchResults[i]["party"],
		state = searchResults[i]["state_name"],
		email = searchResults[i]["oc_email"],
		website = searchResults[i]["website"],
		facebook = searchResults[i]["facebook_id"],
		twitter = searchResults[i]["twitter_id"],
		end = searchResults[i]["term_end"]

		resultString += '<div class="search_result ' + firstName.toLowerCase() + '_' + lastName.toLowerCase() + ' party_' + partyI.toLowerCase() + '">'
		resultString += '<h3>' + firstName + ' ' + lastName + '</h3>'
		resultString += '<h4>' + title + ' &#8211 ' + partyI + '-' + state + '</h4>'
		resultString += '<ul><li><strong>email:</strong> ' + email + '</li><li><strong>website:</strong> ' + website + '</li><li><strong>facebook:</strong> ' + facebook + '</li><li><strong>twitter:</strong> ' + twitter + '</li></ul>'
		resultString += '<sub>Term End > ' + end + '</sub>'
		resultString += '</div>'

		searchResultsContainer.innerHTML += resultString
		

	}
}


// Build Search Select


var buildSelect = function(dataObject) {
	
	var firstObject = dataObject["results"],
	optionString = ""


	for ( var key in firstObject[0]) {

		var key_string = key.replace(/_/g, ' ');
		optionString += '<option value="' + key + '">' + key_string + ' (' + firstObject[0][key] + ')</option>'
	}

	searchOptions.innerHTML = optionString

}


var selectPromise = function() {
	
	var promise = $.getJSON(openStatesURL)
	promise.then(buildSelect)

}



// Search Data

var searchObjects = function(keyPress) {

	if ( keyPress.keyCode === enterKey ) {
		var searchRange = searchOptions.value
		var searchQuery = event.target.value
		searchResultsContainer.innerHTML = ""
		event.target.value = ""
		currentPage = 0
		searchFunction('&' + searchRange + '=' + searchQuery)
	}
	
}

// Page Counter



var addPage = function () {
	
	console.log(currentPage)
	currentPage = currentPage + 1
	console.log(currentPage)
	return('&per_page=12&page=' + currentPage)

}

// Promise

var searchFunction  = function(searchQuery) {

	openStatesURL = 'https://congress.api.sunlightfoundation.com/legislators?apikey=c2451c1bffc14ebbb0b25d2c1ec05364'
	if ( typeof searchQuery === 'string' ) openStatesURL = openStatesURL + searchQuery
		else openStatesURL = openStatesURL
	newPage = addPage()		
	newOpenStatesURL = openStatesURL + newPage

	var promise = $.getJSON(newOpenStatesURL)
	promise.then(formatData)

}

// Events Listeners

searchInput.addEventListener('keydown', searchObjects)
moreButton.addEventListener('click', searchFunction)
searchFunction()
selectPromise()

