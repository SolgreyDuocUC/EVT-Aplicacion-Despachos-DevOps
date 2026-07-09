package com.citt.config;

import com.citt.persistence.entity.Venta;
import com.citt.persistence.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private VentaRepository ventaRepository;

    @Override
    public void run(String... args) throws Exception {
        if (ventaRepository.count() == 0) {
            Venta v1 = Venta.builder()
                    .direccionCompra("Av. Providencia 1234, Santiago")
                    .valorCompra(150000)
                    .fechaCompra(LocalDate.now().minusDays(2))
                    .despachoGenerado(false)
                    .build();

            Venta v2 = Venta.builder()
                    .direccionCompra("Calle Falsa 123, Valparaíso")
                    .valorCompra(45000)
                    .fechaCompra(LocalDate.now().minusDays(1))
                    .despachoGenerado(true)
                    .build();

            Venta v3 = Venta.builder()
                    .direccionCompra("Av. Libertad 567, Viña del Mar")
                    .valorCompra(89990)
                    .fechaCompra(LocalDate.now())
                    .despachoGenerado(false)
                    .build();

            ventaRepository.saveAll(Arrays.asList(v1, v2, v3));
            System.out.println("====== DATOS DE VENTA PRECARGADOS ======");
        }
    }
}
