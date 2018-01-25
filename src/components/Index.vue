<template>
<v-layout row>
	<v-flex xs10 sm8 lg6 offset-lg2 offset-sm2 class="mb-5 mt-2">
		<v-progress-circular v-if="!$store.state.files" indeterminate :size="70" :width="7" color="pink darken-1"></v-progress-circular>
		<v-list two-line subheader>
			<template v-for="(file, index) in $store.state.files">
				<v-list-tile class="log mb-2" avatar v-bind:key="index" ripple>
					<v-list-tile-avatar>
						<v-icon
							v-if="file.status == 'done'"
							large
							color="green lighten-1"
						>
							fa-file-text
						</v-icon>
						<v-icon
							v-else-if="file.status == 'exec'"
							large
							color="orange lighten-1"
						>
							fa-file-text
						</v-icon>
						<v-icon
							v-else
							large
							color="red lighten-1"
						>
							fa-file-text
						</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content
						@click="$router.push({
								name: 'Show',
								params: {
									name: file.name,
									id: index
								},

							})"
					>
						<v-list-tile-title>
							{{ file.name }}
						</v-list-tile-title>
						<v-list-tile-sub-title>
							<span >
								{{ file.statusMessage }}
							</span>
							&mdash;
							{{ file.execTime }} [{{ file.size }}]
						</v-list-tile-sub-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<delete
							v-bind="file"
							:index="index"
							iconColor=""
							v-on:success="resultDelete"
						></delete>
					</v-list-tile-action>
				</v-list-tile>
			</template>
		</v-list>
	</v-flex>
	<v-flex xs2 sm4 lg3 offset-lg2 offset-sm1 class="mb-5 mt-2">
		<statistic></statistic>
	</v-flex>
</v-layout>

</template>

<script>
import LogsService from '@/services/LogsService'
import Delete from './Delete'
import Statistic from './Statistic'
export default {
	name: 'index',
	data () {
		return {
			error: null,
			deleteDialog: false,
			deleteDialogFile: null,
		}
	},
	async mounted () {
		let param = this.$route.params
		let store = this.$store.state
		// Проверим когда необходимо загрузить данные с сервера
		// 1) Когда пуст массив данныx,
		// 	т.е. скорей всего приложение только запустилось
		// 2) Когда перешли на "индексную" страницу с ключом "refresh"
		if (!store.files ||
			param.hasOwnProperty('action') &&
			param.action === 'refresh') {
			this.loadData();
		}
	},
	watch: {
	},
	methods: {
		openDialog(logId) {
			this.deleteDialog = true
			this.deleteDialogFile = logId
		},
		// Удаление файла
		deletelog(logId) {
			LogsService.delete(logId).then((data) => {
				this.deleteDialog = false
				// Обновим данные
				this.loadData();
			}, (err) => {
				console.log(err);
			})
		},
		async loadData() {
			try {
				// Очистим данные если уже есть
				if (this.$store.state.files)
					this.$store.dispatch('setFiles', null)

				// Навесим обработчик на изменение списка файлов,
				// для пересчёта "максимального" времени выполнения
				this.$store.watch((state) => state.files, (filesStore) => {
					let time
					let currentObject
					filesStore.forEach((file) => {
						//Проинициализируем первое значение
						if (!time) time = file.execTimeMs
						// Сравним результат, если текущее значение больше
						// сделаем его как максимальное
						// и так до тех пор пока не найдем самое максимальное
						if (file.execTimeMs > time) {
							time = file.execTimeMs
							currentObject = file
						}
					})
					this.$store.dispatch('setMaxTime', currentObject.execTime)
				})

				// Загрузим данные
				let data = (await LogsService.index()).data
				this.$store.dispatch('setFiles', data.files)
				this.$store.dispatch('setAverageTime', data.averageTime)

			} catch (err) {
				this.error = err;
			}
		},
		resultDelete(id) {
			// Если есть id файла в vuex store, удаляем из vuex store
			if (id) {
				this.$store.state.files.splice(id, 1)
			}
		}
	},
	components: {
		Delete,
		Statistic
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	h1, h2 {
		font-weight: normal;
	}
	a {
		color: #42b983;
	}
	.list__tile__content {
		cursor: pointer;
	}
	.log {
		border: 1px solid #ddd;
	}
</style>
