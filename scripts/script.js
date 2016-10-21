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
var searchOptions = document.querySelector('#searchOptions'), // access the search options select
	searchInput = document.querySelector('#searchBox'), // access the search text input
	searchResultsContainer = document.querySelector('#results'), // access the main html area
	moreButton = document.querySelector('#add12'), // access the load more button
	openStatesURL = 'https://congress.api.sunlightfoundation.com/legislators?apikey=c2451c1bffc14ebbb0b25d2c1ec05364', // make the base url available
	STATE = { // create an object that holds the current state of the page
		currentPage: 1,	// set the current page to 1 on page load
		perPage: 12, // set the results per page value ( future could possibly change this through a select )
		currentPageQuery: '&page_1', // format the base page count query for openstates API
		perPageQuery: '&per_page=12', // format the base results per page query for openstates API
		searchQuery: '' // start with an empty search query
	},
	enterKey = 13 // access the enter key (return key)

// Format Data Function

var formatData = function(dataObject) { // this function will handle the rewriting of the HTML area for search results. The object is sent here by the searchFunction promise function

	var searchResults = dataObject['results'] // access the results array on the dataObject

	for ( var i = 0; i < searchResults.length; i++ ) { // let's loop through the array and get the variables we want.

		if ( searchResults.length < STATE.perPage ) { // while we're looping through the object let's check to see if we'll need to access more data after the first page load
			moreButton.style.visibility = 'hidden' // less than perPage results? let's hide the load more button
		}
		else { moreButton.style.visibility = 'visible' } // more than the perPage results, make that button available

		var resultString = '', // let's load all our variables, starting with the string we'll write into the HTML area
			firstName = searchResults[i]['first_name'], // get the congress person's first name
			lastName = searchResults[i]['last_name'], // get the congress persons's last name
			title = searchResults[i]['title'], // etc. these variable are fairly obvious
			partyI = searchResults[i]['party'],
			state = searchResults[i]['state_name'],
			email = searchResults[i]['oc_email'],
			website = searchResults[i]['website'],
			facebook = searchResults[i]['facebook_id'],
			twitter = searchResults[i]['twitter_id'],
			end = searchResults[i]['term_end']

		resultString += '<div class="search_result ' + firstName.toLowerCase() + '_' + lastName.toLowerCase() + ' party_' + partyI.toLowerCase() + '">' // let's write all our variables to some stylable HTML
		resultString += '<h3>' + firstName + ' ' + lastName + '</h3>'
		resultString += '<h4>' + title + ' &#8211 ' + partyI + '-' + state + '</h4>'
		resultString += '<ul><li><strong>email:</strong> ' + email + '</li><li><strong>website:</strong> ' + website + '</li><li><strong>facebook:</strong> ' + facebook + '</li><li><strong>twitter:</strong> ' + twitter + '</li></ul>'
		resultString += '<sub>Term End > ' + end + '</sub>'
		resultString += '</div>'

		searchResultsContainer.innerHTML += resultString // Have our results ready? Write it to the HTML Area.
		
	}
}


// Build Search Select


var buildSelect = function(dataObject) { // This function will build our select list from the first available object. This might not be the best approach, but it's what we have available right now.
	
	var firstObject = dataObject["results"][0], // We're using the first available object
	optionString = "" // Let's create an empty string to write all our options to


	for ( var key in firstObject) {

		var key_string = key.replace(/_/g, ' '); // for readibility's sake we're doing some rudementary formatting to the property names (strip underscores and Title Case. - not perfect, but it's better than what we had)
		optionString += '<option value="' + key + '">' + key_string + ' (' + firstObject[key] + ')</option>' // we're creating a simple list of options using the keys and values
	}

	searchOptions.innerHTML = optionString // let's write those options to the select

}

// Select Promise Request

var selectPromise = function() { //We need to get the data for our select, let's send a query. Since we only need 1 result it'll be small.
	
	var promise = $.getJSON(openStatesURL + "&per_page=1")
	promise.then(buildSelect)

}



// Search Data

var buildSearchQuery = function(keyPress) {

	if ( keyPress.keyCode === enterKey ) { // check to see if the enter key was pressed and run this function
		var searchRange = searchOptions.value // get the property to search
		var searchQuery = event.target.value // get the specific search query
		searchResultsContainer.innerHTML = "" // clear the search results area
		event.target.value = "" // clear the search box for future searches
		
		STATE.currentPage = 1 // reset page count
		STATE.currentPageQuery = '&page_1'// reset the current page query

		STATE.searchQuery = '&' + searchRange + '=' + searchQuery // generate the full search query

		searchFunction() // invoke the searchFunction
	}
	
}

var buildLoadString = function(clickEvent) { // we need to be able to increment the page, so let's create a small function that'll do that.

	STATE.currentPage = STATE.currentPage + 1 // increment the current page by 1
	STATE.currentPageQuery = '&page=' + STATE.currentPage, // update the page query with the new value

	searchFunction() // invoke the searchFunction

}


// Promise

var searchFunction  = function(searchQuery) { // this is our promise function where we build our query URL

	fetchURL = openStatesURL + STATE.currentPageQuery + STATE.perPageQuery + STATE.searchQuery // we build our url by combining our base URL and our page, per_page and search queries.

	var promise = $.getJSON(fetchURL) // set up our promise
	promise.then(formatData) // send the object to our format function

}

// Events Listeners

searchInput.addEventListener('keydown', buildSearchQuery) // invoke our search query builder when the user hits enter on the search text input
moreButton.addEventListener('click', buildLoadString) // invoke our paginator when the use clicks on the load more button

// Get this page running

searchFunction()
selectPromise()

