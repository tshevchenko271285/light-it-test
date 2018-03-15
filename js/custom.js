'use strict';

Vue.filter('time', function(value){
	let date = new Date(value);
	return date.getMinutes() + ' : ' + date.getSeconds();
});

new Vue ({
	el: '#music',
	data: {
		searchString: '',
		list: [],
		timeout: '',
	},
	watch: {
		searchString: function (newQuestion, oldQuestion) {
			clearTimeout(this.timeout);
			this.timeout = setTimeout( _ => this.getData(newQuestion), 1000 );
		}
	},
	methods: {
		getData: function (str){
			console.log('x');
			let vm = this;
			var items = [];
			fetch('https://itunes.apple.com/search?term=' + str)
			.then(function(response){
				return response.json();
			}).then(function(data){
				items.push(data.results.map(function(item){
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
			this.list = items;
		},
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