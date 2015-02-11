<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2><%: ViewData["Message"] %></h2>
    <script type="text/javascript">
        setDarkTheme();
    </script>
    <p>
        <div id="container-date" style="width:100%; height:400px;"></div>
    </p>
    <p>
        <div id="container-gauge" style="width:300px; height:200px;"></div>
    </p>
    <p>
        <div id="container-jsonp" style="width:100%; height:400px;"></div>
    </p>
    <p>
        <div id="container" style="width:100%; height:400px;"></div>
    </p>
    <p>
        <div id="ajax-container" style="width:100%; height:400px;"></div>
    </p>

</asp:Content>
