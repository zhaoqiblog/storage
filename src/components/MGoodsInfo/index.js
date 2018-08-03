import goodsInfoItem from "./goodsInfoItem";
import goodsSelectGroup from "./goodsSelectGroup";
import goodsSelectItem from "./goodsSelectItem";
import goodsTopInfo from "./goodsTopInfo";
import preItemInfo from "../MpreItemInfo/index";
import preItemPic from "../MpreItemPic/index";
import prePicAll from "../MpreItemPic/indexNew.vue";
import preListConcats from "../MpreList/index"
import preSearchItem from "../MpreSearchItem/index"
const components = [
	goodsInfoItem,
	goodsSelectGroup,
	goodsSelectItem,
	goodsTopInfo,
	preItemInfo,
	preItemPic,
	preListConcats,
	preSearchItem,
	prePicAll,
]

const install = ( Vue, options ) => {
	components.forEach(component => {
		Vue.component(component.name,component);
	})
}

export default {install};