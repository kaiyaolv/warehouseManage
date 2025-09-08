<template>
	<div >
		<!--表格栏-->
		<el-table :data="data.content" :highlight-current-row="highlightCurrentRow" @selection-change="selectionChange"
			@current-change="handleCurrentChange" v-loading="loading" :element-loading-text="$t('action.loading')"
			:border="border" :stripe="stripe" :show-overflow-tooltip="showOverflowTooltip" :height="height" :size="size"
			:align="align" style="width:100%;" ref="multipleTable" :class="{'page-table': isPageTable}">
			<slot name="single"></slot>

			<el-table-column type="selection" width="45" v-if="showBatchDelete"></el-table-column>
			<el-table-column prop="" header-align="center" width="65" align="center" label="序号">

				<template slot-scope="scope">
					<span>{{
	  	        (data.pageNum - 1) * data.pageSize + scope.$index + 1
	  	      }}</span>
				</template>
			</el-table-column>

			<el-table-column v-for="column in columns" header-align="center" align="center" :prop="column.prop"
				:label="column.label" :width="column.width" :min-width="column.minWidth" :key="column.prop"
        :render-header="column.renderHeaderDate"
				:type="column.type" :formatter="column.formatter" :sortable="false" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column :label="$t('action.operation')" width="185" v-if="showOperation" header-align="center"
				align="center">
				<template slot-scope="scope">
					<kt-button icon="fa fa-edit" type="success" :label="$t('action.edit')" :perms="permsEdit"
						:size="size" @click="handleEdit(scope.$index, scope.row)" />
					<kt-button icon="fa fa-trash" :label="$t('action.delete')" :perms="permsDelete" :size="size"
						type="danger" @click="handleDelete(scope.$index, scope.row)" />
				</template>
			</el-table-column>
			<slot name="btns"></slot>


		</el-table>
		<!--分页栏-->
		<div class="bottom-bar" :class="{'page-bottom-bar': isPageTable}">
			<slot name="handleBatch"></slot>
			<kt-button :label="$t('action.batchDelete')" :perms="permsDelete" :size="size" type="danger"
				@click="handleBatchDelete()" :disabled="this.selections.length===0" style="float:left;"
				v-if="showBatchDelete " />

      <el-pagination background @size-change="size_change" layout="total, prev,sizes, pager, next , jumper"
        @current-change="refreshPageRequest" :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize"
        :total="data.totalSize" style="float:right;" :page-sizes="[100, 500, 1000]">
      </el-pagination>
		</div>
	</div>
</template>
<script>
	import KtButton from "@/views/Core/KtButton"
	export default {
		name: 'KtTable',
		components: {
			KtButton
		},
		props: {
			columns: Array, // 表格列配置
			data: Object, // 表格分页数据
			permsEdit: String, // 编辑权限标识
			permsDelete: String, // 删除权限标识
			premsOpare: String,
			size: { // 尺寸样式
				type: String,
				default: 'mini'
			},
			align: { // 文本对齐方式
				type: String,
				default: 'left'
			},
			maxHeight: { // 表格最大高度
				type: Number,
				default: 420
			},
			height: { // 表格最大高度
				type: Number,
				default: 380
			},
			showOperation: { // 是否显示操作组件
				type: Boolean,
				default: true
			},
			border: { // 是否显示边框
				type: Boolean,
				default: false
			},
			stripe: { // 是否显示斑马线
				type: Boolean,
				default: true
			},
			highlightCurrentRow: { // // 是否高亮当前行
				type: Boolean,
				default: true
			},
			showOverflowTooltip: { // 是否单行显示
				type: Boolean,
				default: true
			},
			showBatchDelete: { // 是否显示操作组件
				type: Boolean,
				default: false
			},
      isPageTable: {
        type: Boolean,
        default: false
      }
		},
		data() {
			return {
				// 分页信息
				pageRequest: {
					pageNum: 1,
					pageSize: 100
				},
				loading: false, // 加载标识
				selections: [] // 列表选中列
			}
		},
		methods: {
			// 都选已经选择的
			getHaveSelect(selectionObj) {
				this.data.content.forEach((item, i) => {
					selectionObj.forEach((multItem, j) => {
						if (this.data.content[i].numberId == selectionObj[j]) {
							this.$refs.multipleTable.toggleRowSelection(this.data.content[i],
							true); //这步操作是让  页面显示选中的数据
						}
					})
				})
				this.$refs.multipleTable.clearSelection();
			},
			// 默认全不选
			hideGetItem() {
				this.$refs.multipleTable.clearSelection();
			},
			size_change(num) {
				this.pageRequest.pageSize = num
				this.pageRequest.pageNum = 1
        // this.findPage()
        this.loading = true
				let callback = res => {
					this.loading = false
				}
				this.$emit('findPage', {
					pageRequest: this.pageRequest,
					callback: callback
				})
        this.$nextTick(() => {
            this.$refs.multipleTable.bodyWrapper.scrollTop = 0
        })
			},
			// 分页查询
			findPage: function() {
				this.loading = true;
				let callback = res => {
					this.loading = false;
				}
				this.$emit('findPage', {
					pageRequest: this.pageRequest,
					callback: callback
				})
			},
			// 选择切换
			selectionChange: function(selections) {
				this.selections = selections
				this.$emit('selectionChange', {
					selections: selections
				})
			},
			// 选择切换
			handleCurrentChange: function(val) {
				this.$emit('handleCurrentChange', {
					val: val
				})
			},
			// 换页刷新
			refreshPageRequest: function(pageNum) {
				this.pageRequest.pageNum = pageNum
				this.findPage()
        this.$nextTick(() => {
          if (this.$refs.multipleTable) {
             this.$refs.multipleTable.bodyWrapper.scrollTop = 0
          }
        })
			},
			// 编辑
			handleEdit: function(index, row) {
				this.$emit('handleEdit', {
					index: index,
					row: row
				})
			},
			// 删除
			handleDelete: function(index, row) {
				this.delete(row.id)
			},
			// 批量删除
			handleBatchDelete: function() {
				let ids = this.selections.map(item => item.id).toString()
				this.delete(ids)
			},
			// 删除操作
			delete: function(ids) {
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					let params = []
					let idArray = (ids + '').split(',')
					for (var i = 0; i < idArray.length; i++) {
						params.push({
							'id': idArray[i]
						})
					}
					this.loading = true
					let callback = res => {
						if (res.code == 200) {
							this.$message({
								message: '删除成功',
								type: 'success'
							})
							this.findPage()
						} else {
							this.$message({
								message: '操作失败, ' + res.msg,
								type: 'error'
							})
						}
						this.loading = false
					}
					this.$emit('handleDelete', {
						params: params,
						callback: callback
					})
				}).catch(() => {})
			}
		},
		mounted() {
			this.refreshPageRequest(1)
		}
	}
</script>

<style scoped>
	.toolbar{
		/* border: 1px solid #000000; */
		/* padding-right:18px; */
		background-color: #F0F2F5;
			box-shadow: 0px 10px 34px 30px rgba(37, 40, 47, 0.1);
		/* box-shadow: 0px 12px 24px 0px rgba(37, 40, 47, 0.1); */
	}

</style>
