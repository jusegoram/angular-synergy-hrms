import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseType, ResponseContentType } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Department, Position, Client, Campaign } from '../employee/models/positions-models';


@Injectable()
export class AdminService {
    constructor(private http: Http) { }
    siteURI = environment.siteUri;

getDepartment(){
    return this.http.get(this.siteURI + '/payroll/department')
            .map((response: Response) =>{
                const departments = response.json().obj;
                const transformedDepartments: Department[] = [];
                for(const department of departments) {
                    transformedDepartments.push(new Department(
                        "saved",
                        department._id,
                        department.name,
                        department.positions
                    ));
                }

                return transformedDepartments;
            })
            .catch((err: Response) => Observable.throw(err));
}

saveDepartment(department: Department){
    const token = localStorage.getItem('token')
        ? '?token=' + localStorage.getItem('token') : '';
    const body = JSON.stringify(department);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(this.siteURI + '/payroll/department' + token, body, { headers: headers })
        .map((response: Response) => response.json())
        .catch((error: Response) => Observable.throw(error.json()));
}

updateDepartment(department: Department){
    const body = JSON.stringify(department);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.put(this.siteURI + '/payroll/department?id=' + department.id, body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
}

// getting and setting clients and campaigns
getClient(){
    return this.http.get(this.siteURI + '/admEmp/client')
            .map((response: Response) =>{
                const clients = response.json().obj;
                const transformedClients: Client[] = [];
                for(const client of clients) {
                    transformedClients.push(new Client(
                        "saved",
                        client._id,
                        client.name,
                        client.campaigns
                    ));
                }

                return transformedClients;
            })
            .catch((err: Response) => Observable.throw(err));
}
saveClient(client: Client){
    const token = localStorage.getItem('token')
        ? '?token=' + localStorage.getItem('token') : '';
    const body = JSON.stringify(client);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(this.siteURI + '/admEmp/client' + token, body, { headers: headers })
        .map((response: Response) => response.json())
        .catch((error: Response) => Observable.throw(error.json()));
}

updateClient(client: Client){
    const body = JSON.stringify(client);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.put(this.siteURI + '/admEmp/client?id=' + client.id, body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
}
}