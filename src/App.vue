<template>
	<div id="app">
		<v-app>
			<page-header />
			<main>
				<v-container fluid>
					<router-view/>
				</v-container>
			</main>
			<page-footer />
		</v-app>
	</div>
</template>

<script>
import PageHeader from '@/components/Header'
import PageFooter from '@/components/Footer'
export default {
	name: 'app',
	components: {
		PageHeader,
		PageFooter
	}
}
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
