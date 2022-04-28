package com.vy.HomeKeeper.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Контроллер отвечающий за роутинг и выдачу необходимых представлений
 */
@Controller
public class RoutesController {

    /**
     * @return Корневая страница-приветствие
     */
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String root() {
        return "index";
    }

    /**
     * @return Главная страница дашборда
     */
    @RequestMapping(value = "/dashboard", method = RequestMethod.GET)
    public String dashboard() {
        return "dashboard/main";
    }

    /**
     * @return Страница с списком всех данных по месяцам
     */
    @RequestMapping(value = "/dashboard/list", method = RequestMethod.GET)
    public String dashboardList() {
        return "dashboard/list";
    }

    /**
     * @return Страница детального просмотра информации за месяц
     */
    @RequestMapping(value = "/dashboard/list/detail", method = RequestMethod.GET)
    public String dashboardListDetail() {
        return "dashboard/detail";
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String loginPage() { return "login"; }
}
