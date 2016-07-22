package controleEstoque.rest;

import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.*;

import org.springframework.http.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import controleEstoque.business.CustomBusiness;
import controleEstoque.business.VendaBusiness;
import controleEstoque.entity.DashboardInfoDTO;
import controleEstoque.entity.Venda;

@RestController
@RequestMapping(value = "/api/rest/controleEstoque/Custom")
public class CustomREST {

	@Autowired
	@Qualifier("CustomBusiness")
	private CustomBusiness customBusiness;

	@RequestMapping(method = RequestMethod.GET, value = "/DashboardInfo")
	public DashboardInfoDTO getDashboardInfo() throws Exception {

		DashboardInfoDTO info = new DashboardInfoDTO();
		info.totalVenda = customBusiness.getTotalVenda().intValue();
		info.totalFornecedor = customBusiness.getTotalFornecedor().intValue();
		info.totalCliente = customBusiness.getTotalCliente().intValue();
		info.totalProdutoSemEstoque = customBusiness.getTotalEstoqueZerado().intValue();
		return info;
	}

}
