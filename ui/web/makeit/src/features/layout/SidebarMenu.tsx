import React from 'react';
import { routeDefinitions } from "../../app/Routes";
import { List } from "@material-ui/core"
import { SidebarMenuSection } from './SidebarMenuSection';

export function SidebarMenu() {
  return (
    <nav>
        <List>
            {}
            <SidebarMenuSection section={routeDefinitions.public} />
            <SidebarMenuSection section={routeDefinitions.career} />
        </List>
    </nav>
  );
}
