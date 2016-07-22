package controleEstoque;

import org.springframework.orm.jpa.*;
import org.springframework.context.annotation.*;
import org.springframework.data.jpa.repository.config.*;
import org.springframework.transaction.*;
import org.springframework.transaction.annotation.*;


/**
 * Classe que configura os beans para persistencia
 * 
 * @author Usu�rio de Teste
 *
 */
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        entityManagerFactoryRef = "ControleEstoque-EntityManagerFactory",
        transactionManagerRef = "ControleEstoque-TransactionManager"
)
class ControleEstoqueConfiguration {
  

    @Bean(name="ControleEstoque-EntityManagerFactory")
    public LocalEntityManagerFactoryBean entityManagerFactory() {
        LocalEntityManagerFactoryBean factoryBean = new LocalEntityManagerFactoryBean();
        factoryBean.setPersistenceUnitName("controleEstoque");
        return factoryBean;
    }

    @Bean(name = "ControleEstoque-TransactionManager")
    public PlatformTransactionManager transactionManager() {
        return new JpaTransactionManager(entityManagerFactory().getObject());
    }


}


