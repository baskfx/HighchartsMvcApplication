<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="aboutTitle" ContentPlaceHolderID="TitleContent" runat="server">
    About Us
</asp:Content>

<asp:Content ID="aboutContent" ContentPlaceHolderID="MainContent" runat="server">
    <h2>About</h2>
    <script type="text/javascript">
        sandTheme();
    </script>
    <p>
        <div id="container-scheme" style="width:100%; height:400px; align:center;"></div>
    </p>
</asp:Content>
