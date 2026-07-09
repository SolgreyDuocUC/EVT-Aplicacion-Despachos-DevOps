package com.citt.config;

import com.citt.persistence.entity.Despacho;
import com.citt.persistence.repository.DespachoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private DespachoRepository despachoRepository;

    @Override
    public void run(String... args) throws Exception {
        if (despachoRepository.count() == 0) {
            Despacho d1 = new Despacho();
            d1.setIdCompra(2L); // ID Asumiendo que coincide con Venta 2 precargada
            d1.setDireccionCompra("Calle Falsa 123, Valparaíso");
            d1.setValorCompra(45000L);
            d1.setFechaDespacho(LocalDate.now());
            d1.setPatenteCamion("AB-CD-12");
            d1.setIntento(1);
            d1.setDespachado(false);

            Despacho d2 = new Despacho();
            d2.setIdCompra(10L); 
            d2.setDireccionCompra("Pasaje Los Pinos 45, Concepción");
            d2.setValorCompra(12000L);
            d2.setFechaDespacho(LocalDate.now().minusDays(3));
            d2.setPatenteCamion("XYZ-99");
            d2.setIntento(0);
            d2.setDespachado(true); // Ya entregado

            despachoRepository.saveAll(Arrays.asList(d1, d2));
            System.out.println("====== DATOS DE DESPACHO PRECARGADOS ======");
        }
    }
}
