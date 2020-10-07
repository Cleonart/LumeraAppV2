<template>
	<div>
		<div v-for="form in forms" v-bind:key="form.label">
			
			<!-- label -->
			<label>
                {{form.label}}<span style="color: red">*</span>
            </label>

            <!-- text field -->
			<base-input v-if="form.type == 'text'" 
						type="text"
						v-model="form.text"
						:required="form.required"
						:placeholder="form.placeholder"></base-input>

			<!-- select box -->
			<select v-if="form.type == 'select_box'" v-model="form.text" class="form-control" >
				<option selected disabled>-PILIH-</option>
				<option v-for="option in form.option" v-bind:key="option">{{option}}</option>
			</select>

			<!-- radio button -->
			<span v-if="form.type == 'radio'">
				<base-radio :name="option.value"
							v-for="option in form.option"
							v-bind:key="option.value" 
							class="mb-3" 
							value="1"
							v-model="form.text">
					{{option.label}}
				</base-radio>
			</span>
			
		</div>
			
	</div>
</template>

<script>

	import {mastereditStaff} from "../../functions/masteredit.js"; 

	export default{
		
		name: 'masteredit',
		
		data(){
			return{
				forms : []
			}
		},
		
		methods : {

		},

		created(){
			this.forms = mastereditStaff().inputs;
		}
	}

</script>