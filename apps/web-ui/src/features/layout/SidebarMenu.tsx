import React from 'react';
import { Routes } from "../../app/Routes";
import { List } from "@material-ui/core"
import { SidebarMenuSection } from './SidebarMenuSection';

export function SidebarMenu() {
  return (
    <nav>
        <List>
            <SidebarMenuSection section={Routes.routeDefinitions.public} showDisabled={true} />
            <SidebarMenuSection section={Routes.routeDefinitions.career} showDisabled={true}  />
        </List>
    </nav>
  );
}
