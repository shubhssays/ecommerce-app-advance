package com.banking_app.eureka_service_discovery;

import org.springframework.boot.SpringApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableEurekaServer
public class EurekaServiceDiscoveryApplication {

	public static void main(String[] args) {
		SpringApplication.run(EurekaServiceDiscoveryApplication.class, args);
	}

}
