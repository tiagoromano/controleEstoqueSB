package controleEstoque.dao;

import controleEstoque.entity.*;
import java.util.List;
import org.springframework.stereotype.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.domain.*;
import org.springframework.data.repository.query.*;
import org.springframework.transaction.annotation.*;

@Repository("CustomDAO")
@Transactional(transactionManager="controleEstoque-TransactionManager")
//public interface CustomDAO extends JpaRepository{
public interface CustomDAO extends JpaRepository<Venda, java.lang.String>{

	/**
	 * Construtor
	 **/
	
	//ResponseEntity<String> 
	
	@Query("select count(v.id) from Venda v")
  public Long getTotalVenda();
  
  @Query("select count(e.id) from Estoque e where e.quantidade = 0")
  public Long getTotalEstoqueZerado();
  
  @Query("select count(c.id) from Cliente c")
  public Long getTotalCliente();
  
  @Query("select count(f.id) from Fornecedor f")
  public Long getTotalFornecedor();
}
