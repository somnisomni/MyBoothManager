<script lang="ts">
import { Component } from "vue-facing-decorator";
import { GoodsItem, type IGoodsItemMenuOption } from "@myboothmanager/common-ui";

@Component({})
export default class ManageableGoodsItem extends GoodsItem {
  override menuOptions: IGoodsItemMenuOption[] = [
    {
      icon: "mdi-content-duplicate",
      text: "복제",
      onClick: () => { },
    },
    {
      icon: "mdi-delete",
      text: "삭제",
      onClick: () => { },
    },
  ];
}
</script>
