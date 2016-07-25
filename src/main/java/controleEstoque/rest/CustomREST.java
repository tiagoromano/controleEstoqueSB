package controleEstoque.rest;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import controleEstoque.business.CustomBusiness;
import controleEstoque.business.ProdutoBusiness;
import controleEstoque.entity.DashboardInfoDTO;
import controleEstoque.entity.FaturamentoInfoDTO;

@RestController
@RequestMapping(value = "/api/rest/controleEstoque/Custom")
public class CustomREST {

	@Autowired
	@Qualifier("CustomBusiness")
	private CustomBusiness customBusiness;
	
	@Autowired
	private ProdutoBusiness produtoBusiness;
	
	@PersistenceContext(unitName = "controleEstoque")
  private EntityManager entityManager;

	@RequestMapping(method = RequestMethod.GET, value = "/DashboardInfo")
	public DashboardInfoDTO getDashboardInfo() throws Exception {

		DashboardInfoDTO info = new DashboardInfoDTO();
		info.totalVenda = customBusiness.getTotalVenda().intValue();
		info.totalFornecedor = customBusiness.getTotalFornecedor().intValue();
		info.totalCliente = customBusiness.getTotalCliente().intValue();
		info.totalProdutoSemEstoque = customBusiness.getTotalEstoqueZerado().intValue();
		return info;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/Faturamento")
	public void getFaturamentoMes() throws Exception {
	  
    Date dateIni = getFirstDayOfMonth();
    Date dateEnd = getLastDayOfMonth(dateIni.getMonth(), dateIni.getYear());
	  
	  
	  Query query = entityManager
	  .createQuery("select SUM(vi.quantidade * vi.estoque.valorVenda), vi.venda.dataVenda "+
	               "from VendaItem vi "+
	               "where vi.venda.dataVenda >= :dataIni and vi.venda.dataVenda <= :dataFim  "+
	               "group by vi.venda.dataVenda ")
	               .setParameter("dataIni", dateIni)
	               .setParameter("dateEnd", dateEnd);
	  //.createQuery("select SUM(vi.quantidade * vi.estoque.valorVenda), vi.venda.datavenda from VendaItem vi group by vi.venda.datavenda ");
	  /*.createQuery("select sum(e.valorvenda * vi.quantidade) vendadia, v.datavenda from VendaItem vi " +
	              "join Venda v on (vi.fk_venda = v.id) " + 
	              "join Estoque e on (vi.fk_estoque = e.id) " +
	              "where v.datavenda >= '2016-07-01' and v.datavenda <= '2016-07-31' "+
	              "group by v.datavenda order by v.datavenda");*/
	  //Object results = query.getSingleResult();
	  Object results = query.getResultList();
	  
	  //Object[] results = (Object[]) query.getSingleResult();

    //for (Object object : results) {
    //    System.out.println(object);
    //}
	  
	  
	 // List<ResponseEntity<FaturamentoInfoDTO>>test = customBusiness.getFaturamentoMes();
	  //return null;
	  String teste = "ok";
	}
	
	private Date getLastDayOfMonth(int month, int year) {
    Calendar calendar = Calendar.getInstance();
    // passing month-1 because 0-->jan, 1-->feb... 11-->dec
    calendar.set(year, month - 1, 1);
    calendar.set(Calendar.DATE, calendar.getActualMaximum(Calendar.DATE));
    return calendar.getTime();
  }
  
  private Date getFirstDayOfMonth() {
    Date currentDate = new Date();
    return new Date(currentDate.getYear(), currentDate.getMonth(), 1);
  }

}
