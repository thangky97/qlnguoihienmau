// ** React Imports
import { useContext } from "react";

// ** Vertical Menu Components
import VerticalNavMenuLink from "./VerticalNavMenuLink";
import VerticalNavMenuGroup from "./VerticalNavMenuGroup";
import VerticalNavMenuSectionHeader from "./VerticalNavMenuSectionHeader";

// ** Ability Context
import { AbilityContext } from "@src/utility/context/Can";

// ** Utils
import {
  resolveVerticalNavMenuItemComponent as resolveNavItemComponent,
  canViewMenuGroup,
  canViewMenuItem,
} from "@layouts/utils";
import { getUserData } from "../../../../../utility/Utils";
import { useSelector } from "react-redux";

const VerticalMenuNavItems = (props) => {
  const userData = useSelector((state) => state?.auth?.userData);
  // ** Context
  const ability = useContext(AbilityContext);
  // ** Components Object
  const Components = {
    VerticalNavMenuSectionHeader,
    VerticalNavMenuGroup,
    VerticalNavMenuLink,
  };
  const RenderNavItems = [];
  // ** Render Nav Menu Items
  props.items.map((item, index) => {
    const TagName = Components[resolveNavItemComponent(item)];
    switch (userData?.role) {
      case "CUSTOMER":
        if (item?.isShowTour) {
          RenderNavItems.push(
            canViewMenuItem(item) && (
              <TagName key={item?.id || item?.header} item={item} {...props} />
            )
          );
        }
        break;
      case "ADMIN":
        if (!item?.isShowTour) {
          if (!item?.isNotShowAdmin) {
            RenderNavItems.push(
              canViewMenuItem(item) && (
                <TagName
                  key={item?.id || item?.header}
                  item={item}
                  {...props}
                />
              )
            );
          }
        }
        break;
      default:
        if (item?.default) {
          RenderNavItems.push(
            canViewMenuItem(item) && (
              <TagName key={item?.id || item?.header} item={item} {...props} />
            )
          );
        } else if (item?.defaultGroup && item?.defaultGroup?.length > 0) {
          let checkExisOneManagement = false;
          userData?.authorities?.forEach((author, index) => {
            const checkMangement = item?.defaultGroup?.find(
              (itemDefaultGroup) => itemDefaultGroup === author?.management
            );
            if (checkMangement) {
              checkExisOneManagement = true;
              return;
            }
          });

          checkExisOneManagement &&
            RenderNavItems.push(
              canViewMenuGroup(item) && (
                <TagName item={item} index={index} key={item?.id} {...props} />
              )
            );
        } else if (item?.isNotShowAdmin) {
          if (userData?.role !== "COMPANYADMIN") {
            RenderNavItems.push(
              canViewMenuItem(item) && (
                <TagName
                  key={item?.id || item?.header}
                  item={item}
                  {...props}
                />
              )
            );
          }
        } else if (
          item?.role?.length > 0 &&
          item?.role?.find((item) => item === userData?.role)
        ) {
          RenderNavItems.push(
            canViewMenuItem(item) && (
              <TagName key={item?.id || item?.header} item={item} {...props} />
            )
          );
        } else {
          userData?.authorities?.forEach((author, index) => {
            if (
              (item?.children && item?.management == author.management) ||
              (item?.management == author.management &&
                author.action.includes(item?.action))
            ) {
              if (item?.role && item?.role?.length > 0) {
                const checkRole = item?.role?.filter(
                  (itemRole) => itemRole === userData?.role
                );
                checkRole?.length > 0 &&
                  RenderNavItems.push(
                    canViewMenuGroup(item) && (
                      <TagName
                        item={item}
                        index={index}
                        key={item?.id}
                        {...props}
                      />
                    )
                  );
              } else {
                RenderNavItems.push(
                  canViewMenuGroup(item) && (
                    <TagName
                      item={item}
                      index={index}
                      key={item?.id}
                      {...props}
                    />
                  )
                );
              }
            }
          });
        }

        break;
    }
  });

  return RenderNavItems;
};

export default VerticalMenuNavItems;
