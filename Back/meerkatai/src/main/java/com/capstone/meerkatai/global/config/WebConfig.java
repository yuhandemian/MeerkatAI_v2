package com.capstone.meerkatai.global.config;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebConfig implements ErrorController {

    @RequestMapping(value = {"/", "/error"})
    public String forward() {
        return "forward:/index.html";
    }
}
