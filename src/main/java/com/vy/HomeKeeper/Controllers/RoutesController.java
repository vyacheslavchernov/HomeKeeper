package com.vy.HomeKeeper.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class RoutesController {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String root() {
        return "index";
    }

    @RequestMapping(value = "/dashboard", method = RequestMethod.GET)
    public String dashboard() {
        return "dashboard/main";
    }

    @RequestMapping(value = "/dashboard/list", method = RequestMethod.GET)
    public String dashboardList() {
        return "dashboard/list";
    }

    @RequestMapping(value = "/dashboard/list/detail", method = RequestMethod.GET)
    public String dashboardListDetail() {
        return "dashboard/detail";
    }
}
