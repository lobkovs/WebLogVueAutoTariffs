<template>
	<v-footer class="teal darken-4" fixed>
			<p class="text">Разработал <a href="mailto:aslobkov@mts.ru">Лобков Александр</a> на VueJS © {{ new Date().getFullYear() }}</p>
	</v-footer>
</template>

<script>
export default {
	name: 'Footer',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.text {
		margin: auto;
		color: white;
	}
</style>
