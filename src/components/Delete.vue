<template>
	<!-- <v-layout row> -->
	<div>
		<v-btn v-if="iconColor === 'dark'" dark icon @click="deleteDialog = true">
			<v-icon medium class="pb-1">fa-trash-o</v-icon>
		</v-btn>
		<v-btn v-else icon @click="deleteDialog = true">
			<v-icon medium class="pb-1">fa-trash-o</v-icon>
		</v-btn>
		<v-dialog v-model="deleteDialog" persistent max-width="350">
			<v-card>
				<v-card-title class="headline">
					Удалить?
				</v-card-title>
				<v-card-text class="subheading text-xs-left">
					<span class="title">Вы действительно хотите удалить файл?</span><br><br>
					<span class="body-1">Название: <b>{{ name }}</b></span><br>
					<span class="body-1">Размер: <b>{{ size }}</b><br></span>
					<span class="body-1">Время выполнения: <b>{{ execTime }}</b></span>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="green darken-1" flat @click="deletelog()">Удалить</v-btn>
					<v-btn color="green darken-1" flat @click.native="deleteDialog = false">Отмена</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		</div>
	<!-- </v-layout> -->
</template>

<script>
import LogsService from '@/services/LogsService'
export default {
	name: 'Delete',
	props: {
		name: String,
		execTime: String,
		execTimeMs: Number,
		size: String,
		status: String,
		statusMessage: String,
		index: Number,
		iconColor: {
			type: String,
			default: ''
		},
	},
	data () {
		return {
			deleteDialog: false,
		}
	},
	mounted () {},
	methods: {
		// Удаление файла
		deletelog() {
			LogsService.delete(this.name).then((data) => {
				this.$emit('success', this.index)
				this.deleteDialog = false
			}, (err) => {
				console.log(err);
			})
		},
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
