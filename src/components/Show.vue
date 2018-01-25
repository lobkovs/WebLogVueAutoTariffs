<template>
	<div>
		<v-dialog v-model="dialogShow" fullscreen transition="dialog-bottom-transition" :overlay=false scrollable>
			<v-card>
				<v-toolbar style="flex: 0 0 auto;" dark :class="headerCssClass">
					<v-btn icon @click="close()" dark>
						<v-icon medium class="pb-2">fa-times</v-icon>
					</v-btn>
					<v-toolbar-title>
						Просмотр - {{ dialogTitle }}
					</v-toolbar-title>
					<v-spacer></v-spacer>
					<div v-if="execTime" class="execTime subheading text-xs-left">
						Время выполнения: <b>{{ execTime }}</b>
					</div>
					<div v-if="size" class="size subheading text-xs-left">
						Размер: <b>{{ size }}</b>
					</div>
					<div v-if="statusMessage" class="status subheading text-xs-left">
						Статус: <b>{{ statusMessage }}</b>
					</div>
					<v-spacer></v-spacer>
					<v-toolbar-items class="py-2">
						<delete
							v-bind="fileObj"
							:index="id"
							v-on:success="resultDelete"
						></delete>
						<v-btn
							title="Отменить загрузку"
							v-show="!cancelLoad && !loadIsComplete"
							class="mb-1"
							dark
							icon
							@click.native="cancelLoad = true">
							<v-icon medium>fa-ban</v-icon>
						</v-btn>
					</v-toolbar-items>
				</v-toolbar>
				<div
					height="15"
					v-if="fileSize != 100"
				>
					<v-progress-linear
						class="mt-0 mb-0 pt-0 pb-0"
						v-model="fileSize"
						color="pink"
						height="15"
					></v-progress-linear>
				</div>
				<v-card-text>
					<template v-for="block in dialogBlocks">
						<div v-html="block"></div>
					</template>
				</v-card-text>
				<div style="flex: 1 1 auto;"></div>
			</v-card>
		</v-dialog>

	</div>
</template>

<script>
import LogsService from '@/services/LogsService'
import Delete from './Delete'
export default {
	name: 'Show',
	props: [
		'id'
	],
	data () {
		return {
			dialogShow: false,
			dialogTitle: null,
			dialogBlocks: [],
			divRegExp: /<div((.|\r?\n)*)<\/div>/i, //регулярка на div блоки
			leftOverContent: null, //остаток контента
			fileSize: 0, // Размер файла для "прогресса",
			fileObj: null, // Обьект описание текущего файла лока
			execTime: null, // Время выполнения в секундах
			execTimeMs: null, // Время выполнения в милли секундах
			size: null, // Размер файла
			status: null, // Статус файла
			statusMessage: null, // Текст статуса файла
			headerCssClass: null, // CSS класс для заголовока компонента
								  // характеризующий статус выполнения
			cancelLoad: false,
			loadIsComplete: false
		}
	},
	mounted () {
		this.dialogShow = true;
		this.dialogTitle = this.$route.params.name;
		this.getFileFullInfo()
		this.fillContent()
	},
	methods: {
		// Закрытие компонента
		close (refreshParent) {
			this.dialogShow = false;
			this.dialogContent = null;
			this.$router.push({name: 'Index'})
		},
		// Загрузить данные лога
		fillContent(skip) {
			let offset = skip || 0
			let time = this.dialogBlocks.length ? 0 : 500 //Начальная задержка
			// Запустим с отсрочкой для плавного старта анимации "открытия диалога"
			setTimeout(() => {
				LogsService.show(this.$route.params.name, offset).then((data) => {
					let answer = data.data
					let content = answer.html
					// Сконкатенируем контент с предыдущим если таков остался
					if (this.leftOverContent) {
						content = this.leftOverContent + content
					}
					// Получим совпавший элемент
					let bodyMatches = content.match(this.divRegExp);
					// Нашлось совпадение
					if (bodyMatches != null) {
						// Покажем контент
						this.dialogBlocks.push(bodyMatches[0]);
						// Посчитаем линию прогресса
						this.fileSize = Math.round(answer.len * 100 / answer.size);
						// Получим остаток от контента
						this.leftOverContent = content.substring(bodyMatches.index + bodyMatches[0].length);
					}
					// Если остаток ещё есть, значит незакончили "выкачивать" лог с сервера. Продолжим.
					if (!answer.end && !this.cancelLoad) {
						setTimeout(() => {
							this.fillContent(answer.len)
						}, 200)
					} else {
						this.loadIsComplete = true;
					}
				}, (err) => {
					console.error(err);
				})
			}, time)
		},
		// Загрузить информацию по файлу
		async getFileFullInfo() {
			console.log('ID', this.id);
			if (!this.id) {
				console.info('Нехватает инфы!')
				this.fileObj = (await LogsService.info(this.$route.params.name)).data
			} else {
				console.info('Берём из локальной БД', this.$store.state.files[this.id])
				this.fileObj = this.$store.state.files[this.id]
			}

			this.execTime = this.fileObj.execTime
			this.execTimeMs = this.fileObj.execTimeMs
			this.size = this.fileObj.size
			this.status = this.fileObj.status
			this.statusMessage = this.fileObj.statusMessage
		},
		resultDelete() {
			console.log('Файл успешно удалён!', "ID", this.id)
			// Если есть id файла в vuex store,
			// удаляем из vuex store
			if (this.id) {
				this.$store.state.files.splice(this.id, 1)
			}
			// Закрывает компонент
			this.close();
		}
	},
	watch: {
		// Пересчитываем CSS класс заголовка
		status (newStatus) {
			switch (newStatus) {
				case 'done':
					this.headerCssClass = 'green darken-3'
					break;
				case 'exec':
					this.headerCssClass = 'amber darken-3'
					break;
				default:
					this.headerCssClass = 'red darken-3'
					break;
			}
		}
	},
	components: {
		Delete
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.card__text {
		text-align: justify;
	}
	.execTime,
	.size {
		padding: 0 30px;
		font-size: .9em;
	}
</style>
