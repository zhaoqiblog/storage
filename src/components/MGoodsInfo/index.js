import goodsInfoItem from "./goodsInfoItem";
import goodsSelectGroup from "./goodsSelectGroup";
import goodsSelectItem from "./goodsSelectItem";
import goodsTopInfo from "./goodsTopInfo";
import preItemInfo from "../MpreItemInfo/index";
const components = [
	goodsInfoItem,
	goodsSelectGroup,
	goodsSelectItem,
	goodsTopInfo,
	preItemInfo,
]

const install = ( Vue, options ) => {
	components.forEach(component => {
		Vue.component(component.name,component);
	})
}

export default {install};