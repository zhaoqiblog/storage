import goodsInfoItem from "./goodsInfoItem";
import goodsSelectGroup from "./goodsSelectGroup";
import goodsSelectItem from "./goodsSelectItem";
import goodsTopInfo from "./goodsTopInfo";

const components = [
	goodsInfoItem,
	goodsSelectGroup,
	goodsSelectItem,
	goodsTopInfo,
]

const install = ( Vue, options ) => {
	components.forEach(component => {
		Vue.component(component.name,component);
	})
}

export default {install};