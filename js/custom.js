'use strict';

Vue.component('list-item', {
	props: ['item'],
	methods: {
		// ACCORDION TOGGLE
		opened: function() {
			if (this.item.open)  {
				this.item.open = false;
				return;
			}
			this.$emit('closed');
			this.item.open = true;
		},
	},
	template: `
		<div class="music-item">
			<div v-on:click="opened" class="music-item_header">
				<div class="music-item_image"><img :src="item.сollectionImage" :alt="item.collectionName" class="d-none d-lg-inline img-fluid"></div>
				<div class="music-item_artist">{{item.artist}}</div>
				<div class="music-item_track">{{item.track}}</div>
				<div class="music-item_collection">{{item.collectionName}}</div>
				<div class="music-item_genre">{{item.ganre}}</div>
				<div class="music-item_btn">
					<i v-if="item.open" class="fas fa-minus"></i>
					<i v-else class="fas fa-plus"></i>
				</div>
			</div>
			<div v-if="item.open" class="music-item_body">
				<div class="music-item_image"><img :src="item.сollectionImage" :alt="item.collectionName" class="d-inline d-lg-none img-fluid"></div>
				<div class="music-item_big-section">
					<h3> {{item.artist}} - {{item.track}} <i class="fas fa-music"></i></h3>
					<p><b>Collection:</b> {{item.collectionName}} </p>
					<p><b>Track Count:</b> {{item.trackCount}} </p>
					<p><b>Price:</b> {{item.price}}$</p>
				</div>
				<div class="music-item_big-section">
					<p><b>Track Duration:</b> {{item.trackDuration | time }} min</p>
					<p><b>Track Price:</b> {{item.trackPrice}}$</p>
				</div>
			</div>
		</div>
	`,
});

// FILTER CONVERTS TIME MIN\SEC
Vue.filter('time', function(value){
	let date = new Date(value);
	let min = date.getMinutes().toString();
	let sec = date.getSeconds().toString();
	// ADDS ZEROS TO A SINGLE NUMBER
	if (min.length === 1) { 
		min = '0'+min;
	}
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
		// CLOSED ALL ITEMS
		closed: function() {
			this.list[0].map( item => item.open = false );
		},
	}
});