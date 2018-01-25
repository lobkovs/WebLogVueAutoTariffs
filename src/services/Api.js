import axios from 'axios'

export default() => {
	return axios.create({
		baseURL: 'http://localhost:8080/',
		crossdomain: true
	})
}

// const HTTP = axios.create({
// 	// headers: {
//  //      'Access-Control-Allow-Origin': '*',
//  //      'Content-Type': 'application/json',
//  //    },
// })