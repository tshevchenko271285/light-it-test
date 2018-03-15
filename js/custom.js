'use strict';

// FILTER CONVERTS TIME MIN\SEC
Vue.filter('time', function(value){
	let date = new Date(value);

	let min = date.getMinutes().toString();
	if (min.length === 1) { 
		min = '0'+min;
	}
	let sec = date.getSeconds().toString();
	if (sec.length === 1) {
		sec = '0'+sec;
	}
	return min + ' : ' + sec;
});

// CREATE VUE APP
new Vue ({
	el: '#music',
	data: {
		searchString: '',
		list: [],
		timeout: '',
	},
	watch: {
		// OBSERVE THE SEARCH FORM
		searchString: function (newQuestion, oldQuestion) {
			clearTimeout(this.timeout);
			this.timeout = setTimeout( () => { 
				// EXECUTING THE QUERY
				this.getData(newQuestion);
			}, 1000 );
		}
	},
	methods: {
		// WE GET THE DATA FROM THE SERVER
		getData: function (str){
			fetch('https://itunes.apple.com/search?term=' + str + '&limit=10')
			.then( response => response.json() )
			.then( data => {
				this.list = [];
				// SELECT THE REQUIRED DATA
				this.list.push(data.results.map(item => {
					return {
						сollectionImage: item.artworkUrl100,
						artist: item.artistName,
						track: item.trackName,
						collectionName: item.collectionName,
						ganre: item.primaryGenreName,
						trackCount: item.trackCount,
						price: item.collectionPrice,
						trackDuration: item.trackTimeMillis,
						trackPrice: item.trackPrice,
						open: false,
					};
				}) );
			})
			.catch(function(error){
				console.warn(error);
			});
		},
		// ACCORDION TOGGLE
		opened: function(index) {
			if (this.list[0][index].open)  {
				this.list[0][index].open = false;
				return;
			}
			this.list[0].map( item => item.open = false );
			this.list[0][index].open = true;
		},
	}
});