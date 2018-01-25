<template>
	<!-- <v-layout row wrap> -->
		<v-card color="teal darken-4" class="white--text text-sm-left">
			<v-card-title primary-title>
				<div class="headline">Статистика</div>
			</v-card-title>
			<v-card-text>
				<div class="subheading">
					Среднее время: <b>{{ $store.state.averageTime }}</b>
				</div>
				<div class="subheading">
					Максимальное время: <b>{{ $store.state.maxTime }}</b>
				</div>
			</v-card-text>
		</v-card>
	<!-- </v-layout> -->
</template>

<script>
export default {
	name: 'Statistic',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
