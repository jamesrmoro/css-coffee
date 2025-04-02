module.exports = {
	enabled: true,
  	content: [
	    './*php',
	  	'./content/**/*.php',
  	],
  	theme: {
    	extend: {
	      	backgroundImage: {
		        'table-towel': "url('../images/bg-towel.jpg')",
		        'coffee': "url('../images/bg-coffee.jpg')",
		        'subscribe': "url('../images/bg-subscribe.png')",
		        'title': "url('../images/bg-title.png')",
      		}
   		},
   		screens: {
	      'sm': '640px',
	      'md': '768px', // Padrão para 'md'
	      'lg': '1024px',
	      'xl': '1280px',
	    },
  	},
}