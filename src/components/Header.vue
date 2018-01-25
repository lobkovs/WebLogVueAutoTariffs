<template>
	<v-toolbar class="teal darken-4" dark fixed>
		<v-toolbar-title class="ml-5">{{ msg }}</v-toolbar-title>
	</v-toolbar>
</template>

<script>
export default {
	name: 'Header',
	data () {
		return {
			msg: 'Отчёт автоматизированной загрузки тарифов [CMS Мой МТС]',
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
