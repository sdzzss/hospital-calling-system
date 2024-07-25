<template>
    <div class="myE" id="myEditor">

    </div>
</template>
<script setup>
import { onMounted,defineEmits,defineProps } from "vue";
import E from "wangeditor"
const emit = defineEmits(["event"])
const props = defineProps({
    introduction:String
})
onMounted(() => {
    const editor = new E("#myEditor");
    editor.create();

    //设置初始值
    props.introduction && editor.txt.html(props.introduction)

    editor.config.onchange = function (newHtml) {
        // console.log("change 之后最新的 html", newHtml);

        //子传父
        emit("event",newHtml)
    };
})

</script>